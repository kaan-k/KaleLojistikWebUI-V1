export interface Complaint {
    id?: string;
    type: string;
    shipmentId: string;
    complaintMessageContent: string;
    status?: string;
    response?: string;
    timestamp?: string;
  }
  