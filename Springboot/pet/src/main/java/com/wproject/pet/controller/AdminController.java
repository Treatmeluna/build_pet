package com.wproject.pet.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wproject.pet.dto.BoardReportDTO;
import com.wproject.pet.dto.CommentReportDTO;
import com.wproject.pet.dto.MemberDTO;
import com.wproject.pet.service.BoardReportService;
import com.wproject.pet.service.CommentReportService;
import com.wproject.pet.service.MemberService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
	private final BoardReportService boardReportService;
	private final CommentReportService commentReportService;
	private final MemberService memberService;
	
	@GetMapping("/boardReport")
	public ResponseEntity<Page<BoardReportDTO>> getBoardReports(
			 @PageableDefault(size = Integer.MAX_VALUE, sort = "brid", direction = Direction.DESC) Pageable pageable,
			 @RequestParam(required = false, defaultValue = "0") int page
			){
		System.out.println("신고리스트:"+page);
		Page<BoardReportDTO> boardReports = boardReportService.findAll(pageable);
		return ResponseEntity.ok(boardReports);
	}
	
	@GetMapping("/boardReport/view/{brid}")
	public ResponseEntity<Map<String, Object>> bView(@PathVariable int brid){
		BoardReportDTO boardReportDTO = boardReportService.view(brid);
		Map<String, Object> response = new HashMap<>();
		response.put("boardReport", boardReportDTO);
		return ResponseEntity.ok(response);
	}
	
	@PutMapping("/boardReport/status/{brid}")
	public void bStatusChange(@PathVariable int brid) {
		boardReportService.statusChange(brid);
	}
	
	@GetMapping("/commentReport")
	public ResponseEntity<Page<CommentReportDTO>> getCommentReports(
			@PageableDefault(size = Integer.MAX_VALUE, sort = "crid", direction = Direction.DESC) Pageable pageable,
			@RequestParam(required = false, defaultValue = "0") int page
			){
		Page<CommentReportDTO> commentReports = commentReportService.findAll(pageable);
		return ResponseEntity.ok(commentReports);
	}
	
	@GetMapping("/commentReport/view/{crid}")
	public ResponseEntity<Map<String, Object>> cView(@PathVariable int crid){
		CommentReportDTO commentReportDTO = commentReportService.view(crid);
		Map<String, Object> response = new HashMap<>();
		response.put("commentReport", commentReportDTO);
		return ResponseEntity.ok(response);
	}
	
	@PutMapping("/commentReport/status/{crid}")
	public void cStatusChange(@PathVariable int crid) {
		commentReportService.statusChange(crid);
	}
	
	//회원리스트
	@GetMapping("/memberList")
	public ResponseEntity<Page<MemberDTO>> getPosts(
			@PageableDefault(size = 5, sort = "memberid", direction = Direction.ASC) Pageable pageable,
			@RequestParam(required = false, defaultValue = "0") int page) {
		System.out.println("회원리스트:"+page);
	  Page<MemberDTO> resultPage = memberService.findAll(pageable);
	  return ResponseEntity.ok(resultPage);
	}
	
	//회원리스트 검색
	@GetMapping("/member/search")
	public ResponseEntity<Page<MemberDTO>> search(
			@RequestParam(required = false, defaultValue = "") String field,
			@RequestParam(required = false, defaultValue = "") String word, 
			@RequestParam(name = "page", defaultValue = "0") int page,
			@PageableDefault(size = 5, sort = "memberid", direction = Direction.ASC) Pageable pageable){
		try {
	        Page<MemberDTO> searchResult = memberService.search(field, word, pageable);
	        return ResponseEntity.ok(searchResult);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
	
	//회원 탈퇴
	@DeleteMapping("/withdraw/{userid}")
	@CrossOrigin(origins = "http://localhost:3000") 
	public void memberDelete(@PathVariable String userid) {
		System.out.println("회원탈퇴");
		memberService.delete(userid);
	}
	
}
