package com.wproject.pet.entity;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ColumnDefault;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Member {
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int member_id;
	@NotNull
	private String userid;
	@NotNull
	private String password;
	@NotNull
	private String name;
	@NotNull
	private int tel;
	@NotNull
	private String address;
	@NotNull
	private String email;
	@ColumnDefault("0")
	private String auth;
}
