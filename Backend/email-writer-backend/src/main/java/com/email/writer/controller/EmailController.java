package com.email.writer.controller;

import com.email.writer.entity.EmailContent;
import com.email.writer.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailController {
    private EmailService emailService;
    @PostMapping("/generate")
    public ResponseEntity<String> generateResponse(@RequestBody EmailContent emailContent){
        String response= emailService.generateEmailReply(emailContent);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
