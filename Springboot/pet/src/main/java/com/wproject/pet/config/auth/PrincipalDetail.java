package com.wproject.pet.config.auth;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.wproject.pet.entity.Member;
import com.wproject.pet.repository.MemberRepository;

import lombok.Data;


@Service
public class PrincipalDetail implements UserDetailsService {
	@Autowired
	private MemberRepository memberRepository;
	
//	private Member member;
//	
//	 @Autowired
//	public PrincipalDetail(Member member) {
//		this.member = member;
//	}
//	
//	private Map<String, Object> attributes;
	
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		 System.out.println("loadUserByUsername::" + username);
		    
		    Member member = memberRepository.findByUserid(username);
		    System.out.println(member);
		    if (member == null) {
		    	 System.out.println("로그인실패");
		        throw new UsernameNotFoundException("User not found with username: " + username);
		       
		    }
		    
		    System.out.println("repositorytest::" + username);
		    PrincipalUser pmember = new PrincipalUser(member);
		    return pmember;
	}

}
