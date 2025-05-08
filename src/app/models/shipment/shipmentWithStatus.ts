import { StatusRecord } from '../statusRecord/statusRecord';

export interface ShipmentWithStatus {
  id: string;
  trackingNumber: string;
  senderId: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  weight: number;
  shipmentType: string;
  deliveryAddress: string;
  statusRecordIds: string[];
  assignedEmployeeId?: string;
  warehouseId: string;
  statusRecords?: StatusRecord[];
}
