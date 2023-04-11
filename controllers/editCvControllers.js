const CV = require("../models/schemas/Cv");
const Section = require("../models/schemas/Section");
const SubSection = require("../models/schemas/SubSection");

const editSubsection = async (req, res) => {
  const { cvId, sectionId, subsectionId } = req.params;

  //sift through the following to ensure that changes are present before engaging
  const { title, content, order, dateFrom, dateTo } = req.body;

  try {
    const cv = await CV.findById(cvId);
    const section = await Section.findOne({ _id: sectionId, cv: cvId });
    const subsection = await SubSection.findOne({
      _id: subsectionId,
      section: sectionId,
    });

    if (!cv || !section || !subsection) {
      return res
        .status(404)
        .json({ error: "Subsection/Section/CV Not found in DB" });
    }

    if (cv.user.toString() !== req.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    //sift through the following to ensure that changes are present before engaging
    subsection.title = title;
    subsection.order = order;
    subsection.dateFrom = dateFrom;
    subsection.dateTo = dateTo;
    subsection.content = content;
    await subsection.save();

    res.json({ message: "Subsection updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editSection = async (req, res) => {
  const { cvId, sectionId } = req.params;
  const { title, order } = req.body;

  try {
    const cv = await CV.findById(cvId);
    const section = await Section.findOne({ _id: sectionId, cv: cvId });

    if (!cv || !section) {
      return res.status(404).json({ error: "Section Not found in DB" });
    }

    if (cv.user.toString() !== req.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    section.title = title;
    section.order = order;
    await section.save();

    res.json({ message: "Section updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editCv = async (req, res) => {
  const { cvId } = req.params;
  const { name } = req.body;

  try {
    const cv = await CV.findById(cvId);

    if (!cv) {
      return res.status(404).json({ error: "Not found" });
    }

    if (cv.user.toString() !== req.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    cv.cvName = name;
    await cv.save();

    res.json({ message: "CV updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { editCv, editSection, editSubsection };
