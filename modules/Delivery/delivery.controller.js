import {
  createDeliveryService,
  getAllDeliveriesService,
  getDeliveryByIdService,
  updateDeliveryService,
  deleteDeliveryService,
  toggleDeliveryStatusService
} from '../Delivery/delivery.service.js';

// ============================================
// CREATE DELIVERY
// ============================================
export const createDelivery = async (req, res) => {
  try {
    const delivery = await createDeliveryService(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: delivery
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error creating delivery'
    });
  }
};

// ============================================
// GET ALL DELIVERIES
// ============================================
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await getAllDeliveriesService();
    
    res.status(200).json({
      success: true,
      message: 'Deliveries retrieved successfully',
      data: deliveries
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error fetching deliveries'
    });
  }
};

// ============================================
// GET DELIVERY BY ID
// ============================================
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await getDeliveryByIdService(id);
    
    res.status(200).json({
      success: true,
      message: 'Delivery retrieved successfully',
      data: delivery
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error fetching delivery'
    });
  }
};

// ============================================
// UPDATE DELIVERY
// ============================================
export const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await updateDeliveryService(id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Delivery updated successfully',
      data: delivery
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error updating delivery'
    });
  }
};

// ============================================
// DELETE DELIVERY
// ============================================
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDeliveryService(id);
    
    res.status(200).json({
      success: true,
      message: 'Delivery deleted successfully'
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error deleting delivery'
    });
  }
};

// ============================================
// TOGGLE DELIVERY STATUS
// ============================================
export const toggleDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const delivery = await toggleDeliveryStatusService(id, active);
    
    res.status(200).json({
      success: true,
      message: 'Delivery status toggled successfully',
      data: delivery
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({
      success: false,
      message: error.message || 'Error toggling delivery status'
    });
  }
};