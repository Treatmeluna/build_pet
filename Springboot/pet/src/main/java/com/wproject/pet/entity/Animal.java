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

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Animal {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int animal_id;
	@NotNull
	private String info_num;
	@Column(length = 10)
	@NotNull
	private String gender;
	@CreationTimestamp
	@Temporal(TemporalType.TIMESTAMP)
	@NotNull
	private Date r_date;
	@NotNull
	private String breed;
	@NotNull
	private String location;
	@Column(length = 10)
	@NotNull
	private String surgery;
	private String appearance;
	private String point;
	@NotNull
	private String picture;
	//관할보호센터
	@NotNull
	private String c_name;
	@NotNull
	private String c_address;
	@NotNull
	private String c_tel;
}
