import {Company} from '../models/company.model.js';


//Register a new company
export const registerCompany = async (req, res) => {
    try {
      const { companyName } = req.body;
      if (!companyName) {
        return res.status(401).json({
          message: "Company name is required",
          success: false,
        });
      }
      let company = await Company.findOne({ name: companyName });
      if (company) {
        return res.status(401).json({
          message: "Company already exists",
          success: false,
        });
      }
      company = await Company.create({
        name: companyName,
        userId: req.id,
      });
      return res.status(201).json({
        message: "Company registered successfully.",
        company,
        success: true,
      });
    } catch (error) {
      console.log(error);
    }
  };


//Get all the companies
export const getAllCompanies = async(req, res)=>{
    try{
        const userId = req.id;
        const companies = await Company.find({userId});

        if (!companies){
            return res.status(404).json({
                message: "No companies found",
                success: false,
            });
        }
        return res.json({
            companies,
            success: true,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server Error Cant get all companies",
            success: false,
        })
    }
}

//Get a single company by ID
export const getCompanyById = async(req, res)=>{

    try{
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company){
            return res.status(404).json({
                message: "Company not found",
                success: false,
            })
        }

        return res.status(200).json({
            message: "This is the company.",
            success: true,
            company,
        })

        
    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server error Cannot get CompanyById",
            success: false,
        })
    }
}

//update a company

export const updateCompany  = async(req,res)=> {

    try{
        const {name, description, website, location, logo} = req.body;
        const file = req.file;


        const updateData = {name, description, website, location, logo};
        const companyId = req.params.id;
        
        const company = await Company.findByIdAndUpdate(
            companyId,   //id of the document to update
            updateData,  //new data to update
            {new:true,   runValidators : true}
        );

        //cloudinary 

        if (!company){
            return res.status(404).json({
                message: "Company not found",
                success: false,
            })
        }

        //update database company
        return res.status(200).json({
            message: "Company Updated successfully",
            success: true,
            company,
        })


    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server error cannot update Company",
            success: false,
        })
    }
}