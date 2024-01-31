const Invoice = require("./../models/invoiceModels");

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().populate("userId");
    res.status(200).json({
      message: "success",
      data: {
        invoices,
      },
    });
  } catch (error) {}
};

exports.createInvoice = async (req, res, next) => {
  try {
    const invoice = Invoice({ ...req.body, userId: req.user.id });
    await invoice.save();
    res.status(201).json({
      message: "success",
      data: {
        invoice,
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

    body.itemList && delete body.itemList;
    body.userId && delete body.userId;

    const invoice = await Invoice.findById(id);
    if (String(req.user.id) !== String(invoice.userId))
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
