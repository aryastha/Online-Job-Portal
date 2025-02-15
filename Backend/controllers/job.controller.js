import {Job} from '../models/job.model.js';

//Admin post a job
export const postJob = async (req, res) => {
    try {
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userID = req.id;


        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const job = await Job.create({ 
            title, 
            description, 
            requirements: requirements.split(','),  
            salary: String(salary),
            location,
            jobType, 
            experience: experience,
            position,
            company: companyId,
            created_by: userID,
        });

        return res.status(200).json({
            message: "Job posted successfully",
            job,
            success: true,
        })
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//Users get all jobs
export const getAlljobs = async(req,res) =>{
    try{
        //fetch the keyword from the URL
        const keywords = req.query.keyword || "";
        
        const query = {
            $or:[ //if any of the keywords matches
                {title: {$regex:keywords, $options: "i"}}, //i for case sensitive
                {description:{$regex: keywords, $options: "i"}},
            ],
        }

        const jobs = await Job.find(query).populate({
            path: 'company',
        }).sort({createdAt: -1});

        if(!jobs){
            return res.status(404).json({
                message: "No jobs found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Jobs fetched successfully",
            jobs,
            success: true,
        })

    }catch(error){
        res.status(500).json({message: "Server error jobs by Id", success:false});
    }
}


//get jobs by ID for Users
export const getJobById = async(req,res) =>{
    try{
        
        const jobId = (req.params.id);
        const job = await Job.findById(jobId);

        if(!job){
            return res.status(404).json({
                message: "No job found by this Id",
                success: false,
            })
        }

        return res.status(200).json({
            message: "Job fetched successfully",
            job,
            success: true,
        })


    }catch(error){
        res.status(500).json({message: "Server error job by Id", success:false});
    }
}


//Admin job created

export const getAdminJobs = async(req, res) =>{
    try{

        const adminId = req.id;
        const jobs = await Job.find({created_by: adminId})
        .populate({
            path: 'company',
            sort: {createdAt: -1}
        });

        if (!jobs){
            return res.status(404).json({
                message: "No jobs found by this admin",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Jobs fetched by Id successfully",
            jobs,
            success: true,
        })
    }catch(error){
        res.status(500).json({message: "Server error job by Id", success:false});
    }
}