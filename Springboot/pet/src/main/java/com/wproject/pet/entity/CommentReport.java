package com.wproject.pet.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class CommentReport {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cr_id")
	private int crid;
	@NotNull
	private String c_reason;
	@NotNull
	private String c_reporter;
	@ColumnDefault("'no'")
	private String reportStatus;
	@CreationTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	private Date reportDate;
	@ManyToOne
	@JoinColumn(name="b_id")
	@NotNull
	private Community community;
	@ManyToOne
	@JoinColumn(name="c_id")
	@NotNull
	private Comment comment;
}
