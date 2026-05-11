import { Framework } from "../models/framework.schema.js";

export const createFrameWork = async (req, res, next) => {
  try {
    const {
      name,
      shortCode,
      description,
      authority,
      country,
      version,
      industry,
      appliesTo,
      controls,
    } = req.body;

    if (
      !name ||
      !shortCode ||
      !description ||
      !authority ||
      !country ||
      !industry ||
      !controls ||
      !appliesTo
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
````````````
    const findFramwork = {
      $or: [{ shortCode }, { version }],
    };
    const IsframeworkExist = await Framework.findOne(findFramwork);
    if (IsframeworkExist) {
      return res.status(400).json({
        message: "Framework is already exist",
      });
    }

    const framework = await Framework.create({
      name,
      shortCode,
      description,
      version,
      authority,
      country,
      industry,
      controls,
      appliesTo,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      data: framework,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

//  get framework:
export const getFramework = async (req, res, next) => {
  try {
    const framework = await Framework.find({ isActive: true });
    if (!framework || framework.length === 0) {
      return res.status(400).json({
        message: "No Framwork Exist",
      });
    }
    return res.status(200).json({
      data: framework,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

