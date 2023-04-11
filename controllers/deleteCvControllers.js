const CV = require("../models/schemas/Cv");
const Section = require("../models/schemas/Section");
const SubSection = require("../models/schemas/SubSection");

const deleteSubsection = async (req, res) => {
  const { subsectionId } = req.params;
  const deleted = req.body.deleted || true;

  try {
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Subsection not found" });
    }

    // Mark the subsection as deleted
    subsection.isDeleted = deleted;

    await subsection.save();
    res.status(200).json({
      message: "Subsection deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the Subection" });
  }
};

const deleteSection = async (req, res) => {
  const { sectionId } = req.params;
  const deleted = req.body.deleted || true;

  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    // Mark the section as deleted
    section.isDeleted = deleted;

    // Mark all subsections as deleted
    for (const subsection of section.subSections) {
      const subsectionObj = await SubSection.findById(subsection);
      if (subsectionObj) {
        subsectionObj.isDeleted = deleted;
        await subsectionObj.save();
      }
    }
    await section.save();
    res.status(200).json({
      message: "Section and subsections deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the Section" });
  }
};

const deleteCv = async (req, res) => {
  const { cvId } = req.params;
  const deleted = req.body.deleted || true;

  try {
    const cv = await CV.findById(cvId);

    if (!cv) {
      return res.status(404).json({ error: "CV not found" });
    }

    // Mark the CV as deleted
    cv.isDeleted = deleted;

    // Mark all sections as deleted
    for (const section of cv.sections) {
      const sectionObj = await Section.findById(section);
      if (sectionObj) {
        sectionObj.isDeleted = deleted;
        await sectionObj.save();

        // Mark all subsections as deleted
        for (const subsection of sectionObj.subSections) {
          const subsectionObj = await SubSection.findById(subsection);
          if (subsectionObj) {
            subsectionObj.isDeleted = deleted;
            await subsectionObj.save();
          }
        }
      }
    }

    await cv.save();
    res.status(200).json({
      message: "CV and associated sections/subsections deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the CV" });
  }
};

module.exports = { deleteCv, deleteSection, deleteSubsection };
