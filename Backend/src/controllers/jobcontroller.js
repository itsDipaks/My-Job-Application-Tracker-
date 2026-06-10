import db from "../config/db.js";
import { responsehandler } from "../services/responsehandeler.js";
  import puppeteer from "puppeteer";
export class jobcontroller extends responsehandler {

  constructor() {
    super()
  };

  Add_new_job = async (req, res) => {
    try {
      let data = req.body;
      let userId = req.user?.userId;
      await db.query("Insert into job (user_id,applied_on,company_name,role,source,company_type) values (?,?,?,?,?,?) ", [
          userId,
          data?.applied_on,
          data?.company_name,
          data?.role,
          data?.source,
          data?.company_type,],);
      return this.successResponse(res,"Job Application submitted!");
    } catch (err) {
      return this.serverError(res);
    }
  }
  get_all = async (req, res) => {
    let getUserid = req?.user?.userId;
    console.log(getUserid,"getUserid");
    
    try {
     
    } catch (err) {
        return this.serverError(res);
    }
  }

  scrap_post = async (req, res) => {
    let browser;
    console.log(req.body, "req.body ");
    try {
      const { job_url } = req.body;
      if (!job_url) {
        return res.status(400).json({
          success: false,
          message: "Job URL is required",
        })
      }
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );
      await page.goto(job_url, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await page.waitForSelector("h1", { timeout: 10000 });
      const jobData = await page.evaluate(() => {
        const getText = (selector) =>
          document.querySelector(selector)?.textContent?.trim() || "";
        const getTexts = (selector) =>
          Array.from(document.querySelectorAll(selector))
            .map(el => el.textContent?.trim())
            .filter(Boolean);
        const getAttribute = (selector, attr) =>
          document.querySelector(selector)?.getAttribute(attr) || "";
        return {
          title: getText("h1") || getText('[class*="job-title"]') || getText('[class*="jobTitle"]'),
          company: getText('[class*="comp-name"]') || 
                   getText('[class*="company-name"]') || 
                   getText('[class*="companyName"]') ||
                   getText('[data-testid*="company"]') ||
                   getText('[itemprop="name"]'),
          location: getText('[class*="location"]') || 
                    getText('[class*="loc"]') ||
                    getText('[itemprop="addressLocality"]') ||
                    getText('[data-testid*="location"]'),
          salary: getText('[class*="salary"]') || 
                  getText('[class*="compensation"]') ||
                  getText('[class*="pay"]') ||
                  getText('[data-testid*="salary"]'),
          employmentType: getText('[class*="job-type"]') || 
                          getText('[class*="employment"]') ||
                          getText('[class*="workType"]') ||
                          getText('[itemprop="employmentType"]'),
          experience: getText('[class*="experience"]') || 
                      getText('[class*="exp"]') ||
                      getText('[class*="level"]'),
          description: document.querySelector('[class*="job-desc"]')?.innerText || 
                       document.querySelector('[class*="description"]')?.innerText ||
                       document.querySelector('[itemprop="description"]')?.innerText ||
                       document.querySelector('[class*="jobDescription"]')?.innerText ||
                       "",
          skills: getTexts('[class*="skill"]') ||
                  getTexts('[class*="tag"]') ||
                  getTexts('[class*="keyword"]'),
          companyWebsite: getAttribute('[class*="company-website"]', 'href') ||
                          getAttribute('a[href*="company"]', 'href'),
          companySize: getText('[class*="company-size"]') ||
                       getText('[class*="employees"]'),
          industry: getText('[class*="industry"]') ||
                    getText('[class*="sector"]'),
          postedDate: getText('[class*="posted"]') || 
                      getText('[class*="date"]') ||
                      getText('[datetime]') ||
                      getAttribute('[datetime]', 'datetime'),
          benefits: getTexts('[class*="benefit"]') ||
                    getTexts('[class*="perk"]'),
          applicants: getText('[class*="applicant"]') ||
                      getText('[class*="applied"]'),
          workMode: getText('[class*="remote"]') || 
                    getText('[class*="hybrid"]') ||
                    getText('[class*="work-mode"]') ||
                    getText('[class*="workplace"]'),
          
          // Additional Info
          jobId: getAttribute('[data-job-id]', 'data-job-id') ||
                 getAttribute('[id]', 'id'),
          
          // Education
          education: getText('[class*="education"]') ||
                     getText('[class*="qualification"]'),
          
          // Responsibilities (try to extract as array)
          responsibilities: getTexts('[class*="responsibilit"] li') ||
                            getTexts('[class*="duties"] li'),
          
          // Requirements (try to extract as array)
          requirements: getTexts('[class*="requirement"] li') ||
                        getTexts('[class*="qualification"] li'),
          
          // Meta data
          url: window.location.href,
          scrapedAt: new Date().toISOString(),
        };
      });

      // Clean up empty arrays and null values
      const cleanedData = Object.fromEntries(
        Object.entries(jobData).filter(([_, value]) => {
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'string') return value.length > 0;
          return value != null;
        })
      );

      return res.status(200).json({
        success: true,
        data: cleanedData,
        message: "Job details extracted successfully"
      });
    } catch (err) {
      console.error("Scraping error:", err);

      return res.status(500).json({
        success: false,
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

}

let Myjobcontroller = new jobcontroller();
export default Myjobcontroller;
