package com.wproject.pet.dto;

import java.util.Date;

import com.wproject.pet.entity.Community;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDTO {
	private int c_id;
	private String c_content;
	private String c_writer;
	private Date c_date;
	private int c_like;
	private Community community;
	
}
