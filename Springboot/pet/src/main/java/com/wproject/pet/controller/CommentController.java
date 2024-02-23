package com.wproject.pet.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wproject.pet.dto.CommentDTO;
import com.wproject.pet.dto.CommentReportDTO;
import com.wproject.pet.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
public class CommentController {
	private final CommentService commentService;
	
	@PostMapping("/insert/{bnum}")
	public String insert(@PathVariable Long bnum, @RequestBody CommentDTO commentDTO) {
		commentService.insert(bnum, commentDTO);
		return "success";
	}
	
	@GetMapping("/like/{c_id}")
	public void like(@PathVariable int c_id) {
		commentService.like(c_id);
	}
	
	@DeleteMapping("/delete/{c_id}")
	public int delete(@PathVariable int c_id) {
		commentService.delete(c_id);
		return c_id;
	}
	
	@PostMapping("/report/{c_id}")
	public String insert(@PathVariable int c_id, @RequestBody CommentReportDTO commentReportDTO) {
		commentService.send(c_id, commentReportDTO);
		return "success";
	}
}
