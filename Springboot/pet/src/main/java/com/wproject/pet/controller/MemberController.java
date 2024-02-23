package com.wproject.pet.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.wproject.pet.config.auth.PrincipalDetail;
import com.wproject.pet.config.auth.PrincipalUser;
import com.wproject.pet.dto.CommunityDTO;
import com.wproject.pet.dto.MemberDTO;
import com.wproject.pet.entity.Member;
import com.wproject.pet.entity.Role;
import com.wproject.pet.repository.MemberRepository;
import com.wproject.pet.service.MailService;
import com.wproject.pet.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member/*")
@CrossOrigin(origins = "http://localhost:3000") 
public class MemberController {
	private final MemberService memberService;
	private final MemberRepository memberRepository;
	private final BCryptPasswordEncoder encoder;
	private final MailService mailService;
	
	
	
	//회원가입
	@PostMapping("/join")
	@ResponseBody
	public String insert(@RequestBody MemberDTO memberDTO) {
		System.out.println("test");
		 //id이 있으면 fail
		
		 if(memberRepository.findByUserid(memberDTO.getUserid())!=null) {
			 return "fail";
		 }
		memberService.insert(memberDTO);
		
		return "success";
	}
	
	
	//회원가입시 아이디 중복확인
	@CrossOrigin(origins = "http://localhost:3000") 
	 @PostMapping("/checkId")
	 @ResponseBody
	 public String checkId(@RequestBody MemberDTO memberDTO) {
		System.out.println("아이디 중복확인 테스트");
		Member member = new Member();
		member.setUserid(memberDTO.getUserid());
		 if (memberRepository.findByUserid(member.getUserid()) != null) {
			 System.out.println("fail");
	            return "fail";
	        }
//		 else if(memberRepository.findByUserid(member.getUserid()) == null){
//			 return "null";
//		 }
		 else {
	        	System.out.println("success"+member.getUserid());
	            return "success";
	        }
	 }
	
	//회원가입시 닉네임 중복확인
		@CrossOrigin(origins = "http://localhost:3000") 
		 @PostMapping("/checkNickname")
		 @ResponseBody
		 public String checkNickname(@RequestBody MemberDTO memberDTO) {
			System.out.println("닉네임 중복확인 테스트");
			Member member = new Member();
			member.setNickname(memberDTO.getNickname());
			 if (memberRepository.findByNickname(member.getNickname()) != null) {
				 System.out.println("fail");
		            return "fail";
		        } else {
		        	System.out.println("success"+member.getNickname());
		            return "success";
		        }
		 }
		
	
	
	//회원정보
	@GetMapping("/api/user")
	public Map<String, Object> userInfo(@AuthenticationPrincipal PrincipalUser principaluser){
		System.out.println("회원정보 : "+ principaluser.getUsername() );
		Member member = principaluser.getMember();
		String name = member.getName();
		String nickname = member.getNickname();
		String email = member.getEmail();
		String userid = member.getUserid();
		Role role = member.getRole();
		String tel = member.getTel();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("name",name );
		map.put("nickname",nickname );
		map.put("email",email );
		map.put("tel",tel );
		map.put("role", role);
		map.put("userid", userid);
		if(name==null) {
			name="null";
		}
		return map;
	}
	
	//회원정보 수정
	@PostMapping("/memberupdate")
	@ResponseBody
	public String memberUpdate(@RequestBody MemberDTO memberDTO,@AuthenticationPrincipal PrincipalUser principaluser) {
		Member principalDetailsUser = principaluser.getMember();
		
		memberService.update(principalDetailsUser.getMemberid(),memberDTO);
		principalDetailsUser.setUserid(memberDTO.getUserid());
		principalDetailsUser.setEmail(memberDTO.getEmail());
		principalDetailsUser.setName(memberDTO.getName());
		principalDetailsUser.setNickname(memberDTO.getNickname());
		principalDetailsUser.setTel(memberDTO.getTel());
		return "success";
	}
	
	//회원 탈퇴
		@DeleteMapping("/withdraw/{userid}")
		@CrossOrigin(origins = "http://localhost:3000") 
		public void memberDelete(@PathVariable String userid) {
			System.out.println("회원탈퇴");
			memberService.delete(userid);
		}

	//아이디 찾기
	@PostMapping("/idfind")
	@ResponseBody
	public String idfind(@RequestBody MemberDTO memberDTO) {
		System.out.println("아이디 찾기"+ memberDTO.getName());
		Member member = new Member();
		member.setName(memberDTO.getName());
		member.setTel(memberDTO.getTel());
		if(memberService.searchId(member.getName(),member.getTel())!=null) {
			String findId = memberService.searchId(member.getName(),member.getTel());
			return findId;
		}else {
			return "fail";
		}
		
	}
	
	//비밀번호 찾기
	@PostMapping("/pwfind")
	@ResponseBody
	public String pwfind(@RequestBody MemberDTO memberDTO) {
		System.out.println("pwfind");
		Member member = new Member();
		member.setUserid(memberDTO.getUserid());
		member.setEmail(memberDTO.getEmail());
		System.out.println("이메일 인증 이메일 : " + memberDTO.getEmail());
		if(memberRepository.searchPw(member.getUserid(),member.getEmail())!=null) {
			mailService.pwfind(member.getEmail(),member.getUserid());
			return "success";
		}
		else {
			return "fail";
		}
		
	}
	
	

}
