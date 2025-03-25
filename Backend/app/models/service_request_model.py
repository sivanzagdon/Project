from datetime import datetime
from bson import ObjectId


class ServiceRequest:
    def __init__(self, data: dict):
        self.id = data.get('_id', None)
        self.type = data.get('Type', '')
        self.created_on = self._parse_datetime(data.get('Created on'))
        self.request_id = data.get('Request Id', '')
        self.resolved_date = self._parse_datetime(data.get('Resolved date'))
        self.request_status = data.get('Request status', '')
        self.building = data.get('Building', '')
        self.site = data.get('Site', '')
        self.response_time_hours = data.get('Response time (hours)', 0)
        self.response_time_days = data.get('Response time (days)', 0.0)
        self.main_category = data.get('MainCategory', '')
        self.sub_category = data.get('SubCategory', '')
        self.request_description = data.get('Request description', '')
        self.is_overdue = data.get('is_overdue', 0)

    def _parse_datetime(self, date_str):
        try:
            return datetime.strptime(date_str, "%m/%d/%Y %H:%M")
        except (ValueError, TypeError):
            return None

    def to_dict(self):
        return {
            "Type": self.type,
            "Created on": self.created_on,
            "Request Id": self.request_id,
            "Resolved date": self.resolved_date,
            "Request status": self.request_status,
            "Building": self.building,
            "Site": self.site,
            "Response time (hours)": self.response_time_hours,
            "Response time (days)": self.response_time_days,
            "MainCategory": self.main_category,
            "SubCategory": self.sub_category,
            "Request description": self.request_description,
            "is_overdue": self.is_overdue
        }

    def __repr__(self):
        return f"<ServiceRequest {self.request_id} | Overdue: {self.is_overdue}>"
