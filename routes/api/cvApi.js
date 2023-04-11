const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const cvControllers = require("../../controllers/cvControllers");
const editCvControllers = require("../../controllers/editCvControllers");
const deleteCvControllers = require("../../controllers/deleteCvControllers");
// const cvModel = require("../../models/schemas/Cv");

//create
router
  .route("/")
  .post(
    body("sections.*.subSections")
      .isArray({ min: 1 })
      .withMessage("At least one section is required"),
    cvControllers.validateCV,
    cvControllers.createCv
  );

//update
router.route("/edit/:cvId").put(editCvControllers.editCv);
router
  .route("/edit/:cvId/section/:sectionId")
  .put(editCvControllers.editSection);
router
  .route("/edit/:cvId/section/:sectionId/subsection/:subsectionId")
  .put(editCvControllers.editSubsection);

//delete
router.route("/del/:cvId").delete(deleteCvControllers.deleteCv);
router
  .route("/del/:cvId/section/:sectionId")
  .delete(deleteCvControllers.deleteSection);
router
  .route("/del/:cvId/section/:sectionId/subsection/:subsectionId")
  .delete(deleteCvControllers.deleteSubsection);

//read
router
  .route("/user/:userId")
  .get(param("userId").isMongoId(), cvControllers.getCVsByUser);
router.route("/:cvId").get(param("cvId").isMongoId(), cvControllers.getCVById);
module.exports = router;
