package com.wproject.pet.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AnimalDTO {
	private int animal_id;
	private String info_num;
	private String gender;
	private Date r_date;
	private String breed;
	private String location;
	private String surgery;
	private String appearance;
	private String point;
	private String picture;
	//관할보호센터
	private String c_name;
	private String c_address;
	private String c_tel;
	
}
