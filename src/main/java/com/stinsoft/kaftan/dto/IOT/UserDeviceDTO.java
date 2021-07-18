package com.stinsoft.kaftan.dto.IOT;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.bson.types.ObjectId;
import ss.core.helper.JsonObjectIdSerializer;

public class UserDeviceDTO {

    private String   device_id;
    private String   name;
    private String   unique_Id;
    private boolean  status;

    public String getDevice_id() {
        return device_id;
    }

    public void setDevice_id(String device_id) {
        this.device_id = device_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnique_Id() {
        return unique_Id;
    }

    public void setUnique_Id(String unique_Id) {
        this.unique_Id = unique_Id;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
