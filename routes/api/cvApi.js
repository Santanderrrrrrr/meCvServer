const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const cvControllers = require("../../controllers/cvControllers");
const editCvControllers = require("../../controllers/editCvControllers");
const deleteCvControllers = require("../../controllers/deleteCvControllers");
const cvModel = require("../../models/schemas/Cv");

const verifMid = async (req, res, next) => {
  const tbu = await cvModel.findOne({ _id: req.params.cvId });
  if (!tbu)
    return res
      .status(404)
      .json({ message: `no CV with id: ${req.params.cvId} in DB` });
  if (!tbu.user === req.id)
    return res
      .status(401)
      .json({ message: "you can't perform this action on someone else's CVs" });
  next();
};

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
router.route("/edit/:cvId").put(verifMid, editCvControllers.editCv);
router
  .route("/edit/:cvId/section/:sectionId")
  .put(verifMid, editCvControllers.editSection);
router
  .route("/edit/:cvId/section/:sectionId/subsection/:subsectionId")
  .put(verifMid, editCvControllers.editSubsection);

//delete
router.route("/del/:cvId").delete(verifMid, deleteCvControllers.deleteCv);
router
  .route("/del/:cvId/section/:sectionId")
  .delete(verifMid, deleteCvControllers.deleteSection);
router
  .route("/del/:cvId/section/:sectionId/subsection/:subsectionId")
  .delete(verifMid, deleteCvControllers.deleteSubsection);

//read
router
  .route("/user/:userId")
  .get(param("userId").isMongoId(), cvControllers.getCVsByUser);
router.route("/:cvId").get(param("cvId").isMongoId(), cvControllers.getCVById);
module.exports = router;
