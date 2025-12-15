package com.liferay.hubspot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class HubSpotConfig {

    @Bean
    public WebClient hubSpotWebClient(
            @Value("${liferay.hubspot.auth.token}") String token) {

        return WebClient.builder()
                .baseUrl("https://api.hubapi.com")
                .defaultHeader("Authorization", "Bearer " + token)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}