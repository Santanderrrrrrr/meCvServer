const { validationResult } = require("express-validator");
const User = require("../models/schemas/User");
const CV = require("../models/schemas/Cv");
const Section = require("../models/schemas/Section");
const SubSection = require("../models/schemas/SubSection");

exports.validateCV = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.createCv = async function (req, res) {
  try {
    const { user, sections, cvName } = req.body;

    const theUser = await User.findOne({ _id: user });

    if (!theUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const createdSections = [];

    // Create subSections
    for (const section of sections) {
      const { subSections, ...sectionData } = section;
      const createdSubSections = [];

      for (const subSection of subSections) {
        const createdSubSection = new SubSection({
          ...subSection,
        });
        await createdSubSection.save();
        createdSubSections.push(createdSubSection);
      }

      // Create sections
      const createdSection = new Section({
        ...sectionData,
        subSections: createdSubSections,
      });
      await createdSection.save();
      createdSections.push(createdSection);
    }

    // Create CV
    const createdCV = new CV({
      user,
      sections: createdSections,
      cvName,
    });
    await createdCV.save();

    theUser.cvs.push(createdCV._id);
    await theUser.save();

    res.status(201).json({ cv: createdCV, updateduser: theUser });
  } catch (err) {
    if (err.message.includes("not iterable")) {
      res.status(401).json({ error: " invalid entry" });
    }
  }
};

exports.getCVById = async (req, res) => {
  try {
    console.log("simple hit")
    const cv = await CV.findById(req.params.cvId).populate({
      path: "sections",
      populate: {
        path: "subSections",
      },
    });
    if (!cv) {
      return res.status(404).json({ error: "CV not found" });
    }
    return res.json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCVsByUser = async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.params.userId }).populate({
      path: "sections",
      populate: {
        path: "subSections",
      },
    });
    return res.json(cvs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
