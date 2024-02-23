package com.wproject.pet.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommunityDTO {
	
	private Long bnum;
	private String b_category;
	private String b_title;
	private String b_content;
	private String b_writer;
	private Date b_date;
	private int b_like;
	private int hitcount;
	private int b_comments;

}
