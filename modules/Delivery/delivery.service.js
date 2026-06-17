import Delivery from "../../models/delivery.model.js";

// ============================================
// CREATE DELIVERY
// ============================================
export const createDeliveryService = async (data) => {
  const { location, label, description, note, price } = data;

  // Validation
  if (!location || !label || !description || price === undefined) {
    throw {
      status: 400,
      message: 'Missing required fields: location, label, description, price'
    };
  }

  // Check if location already exists (unique constraint)
  const existingDelivery = await Delivery.findOne({ location });
  if (existingDelivery) {
    throw {
      status: 409,
      message: 'Delivery location already exists'
    };
  }

  // Create and save
  const delivery = await Delivery.create({
    location,
    label,
    description,
    note: note || '',
    price
  });

  return delivery;
};

// ============================================
// GET ALL DELIVERIES
// ============================================
export const getAllDeliveriesService = async () => {
  const deliveries = await Delivery.find().sort({ createdAt: -1 });
  
  if (!deliveries || deliveries.length === 0) {
    return [];
  }

  return deliveries;
};

// ============================================
// GET DELIVERY BY ID
// ============================================
export const getDeliveryByIdService = async (id) => {
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    throw {
      status: 404,
      message: 'Delivery not found'
    };
  }

  return delivery;
};

// ============================================
// UPDATE DELIVERY
// ============================================
export const updateDeliveryService = async (id, data) => {
  const { location, label, description, note, price } = data;

  // Validation
  if (!location || !label || !description || price === undefined) {
    throw {
      status: 400,
      message: 'Missing required fields: location, label, description, price'
    };
  }

  // Check if location already exists (for other deliveries)
  const existingDelivery = await Delivery.findOne({
    location,
    _id: { $ne: id } // Exclude current delivery
  });

  if (existingDelivery) {
    throw {
      status: 409,
      message: 'Delivery location already exists'
    };
  }

  // Update delivery
  const delivery = await Delivery.findByIdAndUpdate(
    id,
    {
      location,
      label,
      description,
      note: note || '',
      price
    },
    { new: true, runValidators: true }
  );

  if (!delivery) {
    throw {
      status: 404,
      message: 'Delivery not found'
    };
  }

  return delivery;
};

// ============================================
// DELETE DELIVERY
// ============================================
export const deleteDeliveryService = async (id) => {
  const delivery = await Delivery.findByIdAndDelete(id);

  if (!delivery) {
    throw {
      status: 404,
      message: 'Delivery not found'
    };
  }

  return delivery;
};

// ============================================
// TOGGLE DELIVERY STATUS
// ============================================
export const toggleDeliveryStatusService = async (id, active) => {
  const delivery = await Delivery.findById(id);

  if (!delivery) {
    throw {
      status: 404,
      message: 'Delivery not found'
    };
  }

  delivery.active = typeof active === 'boolean' ? active : !delivery.active;
  await delivery.save();

  return delivery;
};