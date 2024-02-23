package com.wproject.pet.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
@Entity
public class Community {
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long bnum;
	
	@Column(name = "b_category")
	private String category;
	
	@NotNull
	@Column(name = "b_title")
	private String title;
	
	@NotNull
	@Column(name = "b_content", length = 2000)
	private String content;
	
	@NotNull
	@Column(name= "b_writer")
	private String writer;
	
	@CreationTimestamp
	@Temporal(TemporalType.DATE)
	@JsonFormat(pattern = "yyyy-MM-dd")
	private Date b_date;
	
	@ColumnDefault("0")
	private int b_like;
	
	@ColumnDefault("0")
	private int hitcount;
	
	@ColumnDefault("0")
	private int b_comments;
	
}
