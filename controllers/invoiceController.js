const Invoice = require("./../models/invoiceModels");
const APIFeatures = require("./../utils/APIFeatures");
const catchAsync = require("./../utils/CatchAsync");
const AppError = require("./../utils/AppError");

exports.getInvoices = catchAsync(async (req, res, next) => {
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
});

exports.createInvoice = catchAsync(async (req, res, next) => {
  const invoice = Invoice({ ...req.body, merchant: req.user.id });
  await invoice.save();
  res.status(201).json({
    message: "success",
    data: {
      invoice,
    },
  });
});

exports.getMyInvoices = catchAsync(async (req, res, next) => {
  const invoices = await Invoice.find({ merchant: req.user.id });
  res.status(200).json({
    message: "success",
    result: invoices.length,
    data: {
      invoices,
    },
  });
});

exports.getInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const invoice = await Invoice.findById(id);
  if (!invoice)
    return next(new AppError("Invoice with this id does not exist", 404));
  res.status(200).json({
    message: "success",
    data: {
      invoice,
    },
  });
});

exports.updateInvoice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;

  body.merchant && delete body.merchant;

  const invoice = await Invoice.findById(id);
  if (String(req.user.id) !== String(invoice.merchant))
    return next(
      new AppError("You are not authorized to update this invoice", 401)
    );

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
});
