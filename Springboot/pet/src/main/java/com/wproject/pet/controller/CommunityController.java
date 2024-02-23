package com.wproject.pet.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.wproject.pet.entity.Comment;
import com.wproject.pet.dto.BoardReportDTO;
import com.wproject.pet.dto.CommunityDTO;
import com.wproject.pet.service.CommentService;
import com.wproject.pet.service.CommunityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/community")
@RequiredArgsConstructor
public class CommunityController {
	private final CommunityService communityService;
	private final CommentService commentService;
	
	@PostMapping("/insert")
	public String insert(@RequestBody CommunityDTO communityDTO) {
		communityService.insert(communityDTO);
		return "success";
	}
	
	@GetMapping("/")
	public ResponseEntity<Page<CommunityDTO>> getPosts(
			@PageableDefault(size = 20, sort = "bnum", direction = Direction.DESC) Pageable pageable,
			@RequestParam(required = false, defaultValue = "0") int page) {
	  Page<CommunityDTO> resultPage = communityService.findAll(PageRequest.of(page, pageable.getPageSize(), pageable.getSort()));
	  return ResponseEntity.ok(resultPage);
	}
	
	@GetMapping("/search")
	public ResponseEntity<Page<CommunityDTO>> search(
			@RequestParam(required = false, defaultValue = "") String field,
			@RequestParam(required = false, defaultValue = "") String word, 
			@RequestParam(name = "page", defaultValue = "0") int page,
			@PageableDefault(size = Integer.MAX_VALUE, sort = "bnum", direction = Direction.DESC) Pageable pageable){
		try {
	        Page<CommunityDTO> searchResult = communityService.search(field, word, pageable);
	        return ResponseEntity.ok(searchResult);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}

	@GetMapping("/view/{bnum}")
	public ResponseEntity<Map<String, Object>> view(@PathVariable Long bnum) {
		CommunityDTO communityDTO = communityService.view(bnum);
		List<Comment> comments = commentService.findAll(bnum);
		
		 Map<String, Object> response = new HashMap<>();
		 response.put("community", communityDTO);
		 response.put("comments", comments);

		 return ResponseEntity.ok(response);
	}
	
	@PutMapping("/update/{bnum}")
	public void updatePost(@PathVariable Long bnum, @RequestBody Map<String, Object> requestBody) {
		System.out.println(requestBody);
		CommunityDTO communityDTO = communityService.view(bnum);
		if (requestBody.get("b_category") != null && !((String) requestBody.get("b_category")).isEmpty()) {
	        communityDTO.setB_category((String) requestBody.get("b_category"));
	    }

	    if (requestBody.get("b_title") != null && !((String) requestBody.get("b_title")).isEmpty()) {
	        communityDTO.setB_title((String) requestBody.get("b_title"));
	    }

	    if (requestBody.get("b_content") != null && !((String) requestBody.get("b_content")).isEmpty()) {
	        communityDTO.setB_content((String) requestBody.get("b_content"));
	    }

        communityService.update(communityDTO);
    }
	
	@DeleteMapping("/delete/{bnum}")
	public Long delete(@PathVariable Long bnum) {
		communityService.delete(bnum);
		return bnum;
	}

	@GetMapping("/like/{bnum}")
	public void like(@PathVariable Long bnum) {
		communityService.like(bnum);
	}
	
	@PostMapping("/report/{bnum}")
	public String insert(@PathVariable Long bnum, @RequestBody BoardReportDTO boardReportDTO) {
		communityService.send(bnum, boardReportDTO);
		return "success";
	}
}