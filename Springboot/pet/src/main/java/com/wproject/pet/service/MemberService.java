package com.wproject.pet.service;

import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wproject.pet.dto.CommunityDTO;
import com.wproject.pet.dto.MemberDTO;
import com.wproject.pet.entity.Community;
import com.wproject.pet.entity.Member;
import com.wproject.pet.entity.Role;
import com.wproject.pet.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {
	private final MemberRepository memberRepository;
	private final BCryptPasswordEncoder encoder;

	
	//회원가입
	public void insert(MemberDTO memberDTO) {
		 //비번 암호화
		 String encPassword = encoder.encode(memberDTO.getPassword());
		 Member member=new Member();
		 member.setUserid(memberDTO.getUserid());
		 member.setPassword(encPassword);
		 member.setName(memberDTO.getName());
		 member.setEmail(memberDTO.getEmail());
		 member.setTel(memberDTO.getTel());
		 member.setNickname(memberDTO.getNickname());
		// member.setAddress(memberDTO.getAddress());
		 member.setRole("ROLE_USER");
	
		
		memberRepository.save(member);
	}
	
	//회원정보 수정
	@Transactional
	public void update(int memberid,MemberDTO memberDTO) {
		
		Member member = memberRepository.findByMemberid(memberid);
		String encPassword = encoder.encode(memberDTO.getPassword());
		 if (member != null) {
		        member.setUserid(memberDTO.getUserid());
		        member.setName(memberDTO.getName());
		        member.setEmail(memberDTO.getEmail());
		        member.setTel(memberDTO.getTel());
		        member.setNickname(memberDTO.getNickname());
		        member.setRole("ROLE_USER");
		        member.setPassword(encPassword);
		        // 업데이트된 회원 정보를 저장
		        memberRepository.save(member);
		    } 
	}
	
	//DTO변환
	private Page<MemberDTO> convertToDtoPage(Page<Member> memberListPage) {
	    return new PageImpl<>(
	    		memberListPage.getContent().stream()
	                    .map(member -> new MemberDTO(
	                    		member.getEmail(),
	                    		member.getName(),
	                    		member.getNickname(),
	                    		member.getTel(),
	                    		member.getUserid(),
	                    		member.getMemberid()
	                    ))
	                    .collect(Collectors.toList()),
	                    memberListPage.getPageable(),
	                    memberListPage.getTotalElements()
	    );
	}

	
	//회원리스트
	public Page<MemberDTO> findAll(Pageable pageable){
		Page<Member> lists = memberRepository.findMember(pageable);
		
		return convertToDtoPage(lists);
		}
	
	//회원 리스트 검색
	public Page<MemberDTO> search(String field, String word, Pageable pageable){
		Page<Member> lists;
		
		switch(field){
			case "m_name":
				lists = memberRepository.findByNameContaining(word.toLowerCase(), pageable);
				break;
			case "m_userid":
				lists = memberRepository.findByUseridContaining(word.toLowerCase(), pageable);
				break;
			case "m_tel":
				lists = memberRepository.findByTelContaining(word.toLowerCase(), pageable);
				break;
			
			default: lists = memberRepository.findMember(pageable);
		}
		return convertToDtoPage(lists);	
	}
	//회원 삭제
	@Transactional
	public void delete(String userid) {
		Member member = memberRepository.findByUserid(userid);
		memberRepository.deleteByUserid(member.getUserid());
	}
	
	//아이디 찾기
	public String searchId(String name, String tel) {
		String search = memberRepository.searchId(name,tel);
		return search;
	}
}
