package com.psema4.tictactoe;

import java.util.Map;
import java.util.HashMap;

import org.json.simple.JSONObject;

public class XOuyaController {
	public Integer player;
	public Integer o;
	public Integer u;
	public Integer y;
	public Integer a;
	public Integer l1;
	public Integer r1;
	public Map<String, Double> ls = new HashMap<String, Double>();
	public Map<String, Double> rs = new HashMap<String, Double>();
	public Double l2;
	public Double r2;
	public Integer l3;
	public Integer r3;
	public Map<String, Integer> dpad = new HashMap<String, Integer>();
	
	public XOuyaController(Integer p) {
		player = p;
		o = 0;
		u = 0;
		y = 0;
		a = 0;
		ls.put("x", 0.0);
		ls.put("y", 0.0);
		rs.put("x", 0.0);
		rs.put("y", 0.0);
		l1 = 0;
		r1 = 0;
		l2 = 0.0;
		r2 = 0.0;
		l3 = 0;
		r3 = 0;
		dpad.put("up", 0);
		dpad.put("down", 0);
		dpad.put("left", 0);
		dpad.put("right", 0);
	}
	
	@SuppressWarnings("unchecked")
	public String getJSON() {
		JSONObject cData;
		
		cData = new JSONObject();
		cData.put("player", player);
		cData.put("o", o);
		cData.put("u", u);
		cData.put("y", y);
		cData.put("a", a);
		cData.put("l1", l1);
		cData.put("r1", r1);
		cData.put("ls", ls);
		cData.put("rs", rs);
		cData.put("l3", l3);
		cData.put("r3", r3);
		cData.put("dpad", dpad);
		
		return cData.toJSONString();
	}
}
