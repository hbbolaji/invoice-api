const Invoice = require("./../models/invoiceModels");
const APIFeatures = require("./../utils/APIFeatures");

exports.getInvoices = async (req, res, next) => {
  try {
    let features = new APIFeatures(Invoice, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const invoices = await features.query;
    res.status(200).json({
      message: "success",
      result: invoices.length,
      data: {
        invoices,
      },
    });
  } catch (error) {}
};

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = Invoice({ ...req.body, merchant: req.user.id });
    await invoice.save();
    res.status(201).json({
      message: "success",
      data: {
        invoice,
      },
    });
  } catch (error) {}
};

exports.getMyInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ merchant: req.user.id });
    res.status(200).json({
      message: "success",
      data: {
        invoices,
      },
    });
  } catch (error) {}
};

exports.getInvoice = async (req, res, next) => {
  try {
    const { id } = req.query;
    const invoice = await Invoice.findById(id);
    res.status(200).json({
      message: "success",
      data: {
        invoice,
      },
    });
  } catch (error) {}
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;

    body.merchant && delete body.merchant;

    const invoice = await Invoice.findById(id);
    if (String(req.user.id) !== String(invoice.merchant))
      return next(new Error("You are not authorized to update this invoice"));

    Object.keys(body).forEach((key) => {
      invoice[key] = body[key];
    });

    await invoice.save();

    res.status(200).json({
      message: "success!",
      data: {
        invoice,
      },
    });
  } catch (error) {}
};
