const vendorModel = require("../models/vendorModel");

// ======================================
// Get All Vendors
// ======================================
async function getAllVendors(req, res) {

    try {

        const vendors = await vendorModel.getAllVendors();

        return res.status(200).json({
            success: true,
            count: vendors.length,
            data: vendors
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve vendors."
        });

    }

}

// ======================================
// Get Vendor By ID
// ======================================
async function getVendorById(req, res) {

    try {

        const vendor = await vendorModel.getVendorById(req.params.id);

        if (!vendor) {

            return res.status(404).json({
                success: false,
                message: "Vendor not found."
            });

        }

        return res.status(200).json({
            success: true,
            data: vendor
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve vendor."
        });

    }

}

// ======================================
// Approve Vendor
// ======================================
async function approveVendor(req,res){

    try{

        const result=await vendorModel.approveVendor(req.params.id);

        if(result.affectedRows===0){

            return res.status(404).json({

                success:false,

                message:"Vendor not found."

            });

        }

        const authModel=require("../models/authModel");

        await authModel.createNotification(

            req.params.id,

            "Vendor Approved",

            "Congratulations! Your vendor account has been approved. You can now login and start uploading products."

        );

        return res.json({

            success:true,

            message:"Vendor approved successfully."

        });

    }

    catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Unable to approve vendor."

        });

    }

}

// ======================================
// Reject Vendor
// ======================================
async function rejectVendor(req, res) {

    try {

        const result = await vendorModel.rejectVendor(req.params.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Vendor not found."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Vendor rejected successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to reject vendor."
        });

    }

}

// ======================================
// Suspend Vendor
// ======================================
async function suspendVendor(req, res) {

    try {

        const result = await vendorModel.suspendVendor(req.params.id);

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Vendor not found."
            });

        }

        return res.status(200).json({
            success: true,
            message: "Vendor suspended successfully."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to suspend vendor."
        });

    }

}

// ======================================
// Vendor Statistics
// ======================================
async function getVendorStats(req, res) {

    try {

        const stats = await vendorModel.getVendorStats();

        return res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve vendor statistics."
        });

    }

}

module.exports = {

    getAllVendors,
    getVendorById,
    approveVendor,
    rejectVendor,
    suspendVendor,
    getVendorStats

};