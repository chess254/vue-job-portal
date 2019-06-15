const AuthenticationController = require('../controllers/AuthenticationController');
const ProfileController = require('../controllers/ProfileController');
const JobController = require('../controllers/JobController');
const EmployerController = require('../controllers/EmployerController');
const { EmployerProfile } = require('../models')
const multer = require('multer');
const path = require('path')
let employer_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/employers/')
    },
    filename: function(req, file, cb){
        cb(null,   new Date().toISOString().replace(/:/g, '_')+'_'+ file.originalname)
    }
});


let jobseeker_storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/jobseekers/')
    },
    filename: function(req, file, cb){
        cb(null,  new Date().toISOString().replace(/:/g, '-')+'_'+ file.originalname)
    }
});

const fileFilter = (req, file, cb) =>{
    // Set Allowed ext
    const allowedFiletypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = allowedFiletypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = allowedFiletypes.test(file.mimetype);
    if(mimetype && extname){
        cb(null, true)
    }else{
        cb(new Error('File type must be an image: .jpeg, .jpg, or .png!'), false);
    }
}

const employer_upload = multer({
    storage: employer_storage, 
    limits: { fieldSize: 1024 * 1024 * 8 },  
    fileFilter: fileFilter
}).single('file');

const jobseeker_upload = multer({
    storage: jobseeker_storage, 
    limits: {fieldSize: 1024 * 1024 * 8},  
    fileFilter: fileFilter
}).single('file');

module.exports = (app, express)  =>{
    app.get('/', (req, res)=>{
        res.send('This is the server start page')
    })

  app.use('/uploads/employers',express.static('../../uploads/employers/'))

 /**** Job Seeker ****/
    // Get employer profile info
    app.get('/jobseeker/:jobseekerId/profile', ProfileController.getJobSeekerProfileInfo)
    // Update jobseeker profile info 
    app.post('/jobseeker/profile/', ProfileController.updateJobseekerProfile)
    // Send employer login credentials
    app.post('/jobseeker/login', AuthenticationController.jobseekerLogin)
    // Send jobseeker registration info
    app.post('/jobseeker/register', AuthenticationController.jobseekerRegister)
    app.post('/jobseeker/:jobseekerId/job/:jobId/apply', JobController.applyforJob)
    app.get('/check/jobseeker/:jobseekerId/job/:jobId/application', JobController.checkJobSeekerApplication)
    app.get('/jobseeker/:jobseekerId/profile/applications', ProfileController.getJobAppliedFor)
   
    
 /**** Employer ****/
    // Get employer profile info
    app.get('/employer/:employerId/profile', ProfileController.getEmployerProfileInfo)
    // Send employer login credentials
    app.post('/employer/login', AuthenticationController.employerLogin)
    // Send employer registration info
    app.post('/employer/register', AuthenticationController.employerRegister)
    // Update employer profile info
    app.post('/employer/profile/', ProfileController.updateEmployerProfile)
    
    app.get('/job/categories', EmployerController.getCategories)
    app.get('/job/types', EmployerController.getJobTypes)
    app.post('/employer/create/job', EmployerController.createJob)
    app.post('/employer/update/job', EmployerController.updateJob)
    app.get('/employer/:employerId/jobs', EmployerController.getEmployerJobs)
    app.get('/employer/featured/companies', EmployerController.getFeaturedCompanies)  
    app.get(`/employer/:employerId/job/applicants`, EmployerController.getJobApplicants)

    /***** Job ****/   
    // Get all jobs
    app.get('/jobs/all', JobController.viewAllJobs)
    // Search for specific job
    app.get('/job/search/:search', JobController.searchJob)
    // Get individual job details, 
    app.get('/job/:jobId/detail', JobController.viewJob)
    // Get individual company details
    app.get('/employer/job/:employerId/detail', JobController.employerJob)

    // Uploads
        app.post('/jobseeker/:jobseekerId/resume/upload', function(req, res){
            jobseeker_upload(req, res, function(err){
                if(err instanceof multer.MulterError){
                    console.log(`There was a multer error:${err}`);
                    // Multer Error
                    res.status(500).send({
                        error: err
                    })
                } else if (err){
                    // Unknown error
                    res.status(500).send({
                        error: err
                    })
                } else {
                    // Everything went fine
                    res.status(200).send({
                        'success': 'Every thing went fine'
                    })
                } 
                   
               
            })
        })
        
        app.post('/jobseeker/:jobseekerId/coverletter/upload', function(req,  res){ 
            jobseeker_upload(req, res, function(err){
                if(err instanceof multer.MulterError){
                    console.log(`There was a multer error:${err}`);
                    // Multer Error
                    res.status(500).send({
                        error: err
                    })
                } else if (err){
                    // Unknown error
                    res.status(500).send({
                        error: err
                    })
                }  else {
                    // Everything went fine
                    res.status(200).send({
                        'success': 'Every thing went fine'
                    })
                } 
               
                
            })
        })
        app.post('/employer/:employerId/company/photo/upload', function(req,  res){ 
            employer_upload(req, res, function(err){
                if(err instanceof multer.MulterError){
                    console.log(`There was a multer error:${err}`);
                    // Multer Error
                    res.status(500).send({
                        error: err
                    })
                } else if (err){
                    // Unknown error
                    res.status(500).send({
                        error: err
                    })
                }  else {
                    // Everything went fine

                    res.status(200).send({
                        'success': 'Every thing went fine'
                    })
                } 
                  
            
            })
        })
        app.post('/employer/:employerId/company/logo/upload', function(req,  res){ 
                // console.log(`Response: ${JSON.stringify(res)}`);
                 // console.log(`Response: ${JSON.stringify(employer_upload)}`);
                employer_upload(req, res, function(err){
                    console.log(`File: ${JSON.stringify(req.file)}`);
                    if(err instanceof multer.MulterError){
                        console.log(`There was a multer error:${err}`);
                        // Multer Error
                        res.status(500).send({
                            error: err
                        })
                    } else if (err){
                        // Unknown error
                        console.log(`There was a multer error:${err}`);
                        res.status(500).send({
                            error: err
                        })
                    }  else {
                        // Everything went fine
                        EmployerProfile.update({logo: req.file.path,},
                            {where: {EmployerId: req.params.employerId}})
                        res.status(200).send({
                            'success': 'Every thing went fine'
                        })
                    } 
                })
                
               
        })



        
}