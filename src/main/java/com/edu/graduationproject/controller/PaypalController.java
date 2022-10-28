package com.edu.graduationproject.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.edu.graduationproject.entity.Order;
import com.edu.graduationproject.model.PaypalPaymentIntent;
import com.edu.graduationproject.model.PaypalPaymentMethod;
import com.edu.graduationproject.service.OrderService;
import com.edu.graduationproject.service.PaypalService;
import com.edu.graduationproject.utils.CommonUtils;
import com.edu.graduationproject.utils.URLUtils;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;

@Controller
public class PaypalController {

    private static final Logger LOGGER = LoggerFactory.getLogger(PaypalController.class);

    public static final String PAYPAL_SUCCESS_URL = "/pay/success";
    public static final String PAYPAL_CANCEL_URL = "/pay/cancel";

    @Autowired
    private PaypalService paypalService;

    @Autowired
    OrderService orderService;

    @PostMapping("/pay")
    public ModelAndView pay(
            @RequestParam("total") String total,
            HttpServletRequest request, ModelMap model)
            throws IOException {
        Double _total = CommonUtils.convertCurrency("VND", "USD", Double.parseDouble(total.replace(",", "")));
        if (_total == 0.0) {
            model.addAttribute("message", "Your cart is empty!");
            return new ModelAndView("redirect:/", model);
        }
        String cancelUrl = URLUtils.getBaseURl(request) + PAYPAL_CANCEL_URL;
        String successUrl = URLUtils.getBaseURl(request) + PAYPAL_SUCCESS_URL;

        try {
            Payment payment = paypalService.createPayment(
                    _total,
                    "USD",
                    PaypalPaymentMethod.paypal,
                    PaypalPaymentIntent.sale,
                    "Pay for ShoeShy order",
                    cancelUrl,
                    successUrl);
            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    System.out.println(links.getHref());
                    return new ModelAndView("redirect:" + links.getHref(), model);
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            LOGGER.error(e.getMessage());
        }
        model.addAttribute("message", "Please checkout again!");
        return new ModelAndView("redirect:/order/checkout", model);
    }

    @GetMapping(value = PAYPAL_CANCEL_URL)
    public ModelAndView cancelPay(ModelMap model) {
        model.addAttribute("message", "You have canceled the payment!");
        return new ModelAndView("redirect:/", model);
    }

    @GetMapping(value = PAYPAL_SUCCESS_URL)
    public ModelAndView successPay(ModelMap model, @RequestParam("paymentId") String paymentId,
            @RequestParam("PayerID") String payerId) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);
            if (payment.getState().equals("approved")) {
                model.addAttribute("message", "You have successfully completed the payment!");
                model.addAttribute("isPaymentSuccess", true);
                return new ModelAndView("redirect:/", model);
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            LOGGER.error(e.getMessage());
        }
        return new ModelAndView("redirect:/", model);
    }

    private void createOrder() {
        Order order = new Order();
    }

}
