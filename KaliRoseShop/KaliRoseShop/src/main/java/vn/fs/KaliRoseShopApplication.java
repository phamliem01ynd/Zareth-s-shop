package vn.fs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
@EnableScheduling
public class KaliRoseShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(KaliRoseShopApplication.class, args);
    }
}
