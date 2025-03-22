package com.email.writer.service;

import com.email.writer.entity.EmailContent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailService {
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    private final WebClient webClient;

    public EmailService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailContent emailContent){
        String prompt=buildPrompt(emailContent);

        Map<String, Object> requestBody=Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        String response=webClient.post()
                .uri(geminiApiUrl+geminiApiKey)
                .header("Content-type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return extractResponse(response);

    }

    private String extractResponse(String response) {
        try{
            ObjectMapper objectMapper=new ObjectMapper();
            JsonNode rootNode=objectMapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }
        catch (Exception e){
            throw new RuntimeException("Error processing request!");
        }

    }

    private String buildPrompt(EmailContent emailContent) {
        StringBuilder sb=new StringBuilder();
        sb.append("Generate a professional email for the following email content. Please don't generate the subject line or any other text in your response. I just need the email in your response, nothing else!");
        if(emailContent.getTone()!=null && !emailContent.getEmailContent().isEmpty()){
            sb.append("Kindly keep the tone as ").append(emailContent.getTone());
        }
        sb.append("\n Original email content is given as follows: \n").append(emailContent.getEmailContent());
        return sb.toString();
    }
}
