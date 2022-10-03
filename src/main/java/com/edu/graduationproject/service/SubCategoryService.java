package com.edu.graduationproject.service;

import java.util.List;

import com.edu.graduationproject.entity.SubCategory;

public interface SubCategoryService {
    public List<SubCategory> findAll();

    public List<SubCategory> findAllByCatesId(Integer category_id);
}