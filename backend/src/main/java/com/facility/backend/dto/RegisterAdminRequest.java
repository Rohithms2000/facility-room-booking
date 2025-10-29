package com.facility.backend.dto;

import lombok.Data;

@Data
public class RegisterAdminRequest {

    private String name;

    private String email;

    private String password;
}
