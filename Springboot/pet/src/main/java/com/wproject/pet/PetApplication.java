package com.wproject.pet;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.wproject.pet.dto.MemberDTO;
import com.wproject.pet.entity.Member;
import com.wproject.pet.entity.Role;
import com.wproject.pet.repository.MemberRepository;

@SpringBootApplication
public class PetApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetApplication.class, args);
	}
	
	@Bean
    public CommandLineRunner init(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
        return args -> {
        	
        	 
            // Create an admin user if not exists
            if (memberRepository.findByUserid("admin") == null) {
                Member adminUser = new Member();
                adminUser.setUserid("admin");
                adminUser.setPassword(passwordEncoder.encode("adminPassword!"));
                adminUser.setRole("ROLE_ADMIN");
                adminUser.setName("운영자");
                adminUser.setNickname("운영자");
                memberRepository.save(adminUser);
            }
        };
    }
}
