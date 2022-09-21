package com.edu.graduationproject.service.impl;

import com.edu.graduationproject.entity.Order;
import com.edu.graduationproject.entity.OrderDetails;
import com.edu.graduationproject.entity.User;
import com.edu.graduationproject.repository.OrderDetailRepository;
import com.edu.graduationproject.repository.OrderRepository;
import com.edu.graduationproject.service.OrderService;
import com.edu.graduationproject.service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderRepository orderRepo;

    @Autowired
    UserService userService;

    @Autowired
    OrderDetailRepository orderDetailRepo;

    @Override
    public Order create(JsonNode orderData) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Order findById(long id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Order> findByUsername(String username) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Order> findAll() {
        // TODO Auto-generated method stub
        return null;
    }

    
}