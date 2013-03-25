package com.psema4.tictactoe;

import java.util.ArrayList;
import java.util.List;
import android.os.Bundle;
import android.app.Activity;
import android.graphics.Color;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;

import tv.ouya.console.api.*;

public class MainActivity extends Activity {
	public WebView webView;
	public WebAppInterface webAppInterface;
	public List <XOuyaController> controllers = new ArrayList<XOuyaController>();
	
	public String url = "file:///android_asset/index.html";
//	public String url = "http://projects.psema4.com/ouya/tictactoe/index.html";
	
	public enum XOuyaButton {
		O, U, Y, A,
		L1, L3, R1, R3,
		UP, DOWN, LEFT, RIGHT
	}

	@SuppressWarnings("deprecation")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		OuyaController.init(this);
		setContentView(R.layout.activity_main);
		
		webView = (WebView) findViewById(R.id.webView1);
		webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
		webView.setBackgroundColor(Color.BLACK);
		
		WebViewClient wvc = new XOuyaWebViewClient();
		webView.setWebViewClient(wvc);
		
		WebSettings webViewSettings = webView.getSettings();
		webViewSettings.setJavaScriptCanOpenWindowsAutomatically(true);
		webViewSettings.setJavaScriptEnabled(true);
		webViewSettings.setPluginsEnabled(true);
		webViewSettings.setBuiltInZoomControls(true);
		webViewSettings.setPluginState(PluginState.ON);
		
		controllers.add(new XOuyaController(0));
		controllers.add(new XOuyaController(1));
		controllers.add(new XOuyaController(2));
		controllers.add(new XOuyaController(3));

		webAppInterface = new WebAppInterface(this, webView, controllers);
		webView.addJavascriptInterface(webAppInterface, "xouya");
		webView.loadUrl(url);
	}
	
	public void clearButtons(Integer player) {
		if (player >= 0 && player < 4) {
			XOuyaController cData = controllers.get(player);
		
			cData.o = 0;
			cData.u = 0;
			cData.y = 0;
			cData.a = 0;
			cData.l1 = 0;
			cData.r1 = 0;
			cData.l3 = 0;
			cData.r3 = 0;
			cData.dpad.put("up", 0);
			cData.dpad.put("down", 0);
			cData.dpad.put("left", 0);
			cData.dpad.put("right", 0);
		}
	}
	
	public void setButton(Integer player, XOuyaButton button, Integer value) {
		if (player >= 0 && player < 4) {
			XOuyaController cData = controllers.get(player);
			switch(button) {
			case O:
				cData.o = value;
				break;
	
			case U:
				cData.u = value;
				break;
	
			case Y:
				cData.y = value;
				break;
	
			case A:
				cData.a = value;
				break;
	
			case L1:
				cData.l1 = value;
				break;
	
			case R1:
				cData.r1 = value;
				break;
	
			case L3:
				cData.l3 = value;
				break;
	
			case R3:
				cData.r3 = value;
				break;
	
			case UP:
				cData.dpad.put("up", value);
				break;
	
			case DOWN:
				cData.dpad.put("down", value);
				break;
	
			case LEFT:
				cData.dpad.put("left", value);
				break;
	
			case RIGHT:
				cData.dpad.put("right", value);
				break;
	
			}
		}
	}
	
	@Override
	public boolean onKeyUp(int keyCode, KeyEvent event) {
		boolean handled = false;

	    int player = OuyaController.getPlayerNumByDeviceId(event.getDeviceId());
	    switch(keyCode) {
        case OuyaController.BUTTON_O:
        	setButton(player, XOuyaButton.O, 0);
            handled = true;
            break;

        case OuyaController.BUTTON_U:
        	setButton(player, XOuyaButton.U, 0);
            handled = true;
            break;

        case OuyaController.BUTTON_Y:
    		setButton(player, XOuyaButton.Y, 0);
            handled = true;
            break;

	    case OuyaController.BUTTON_A:
       		setButton(player, XOuyaButton.A, 0);
            handled = true;
            
            break;
            
	    case OuyaController.BUTTON_L1:
       		setButton(player, XOuyaButton.L1, 0);
            handled = true;
	    	break;
	    	
	    case OuyaController.BUTTON_R1:
       		setButton(player, XOuyaButton.R1, 0);
            handled = true;
	    	break;
	    	
	    case OuyaController.BUTTON_DPAD_UP:
       		setButton(player, XOuyaButton.UP, 0);
	    	handled = true;
	    	break;

	    case OuyaController.BUTTON_DPAD_DOWN:
       		setButton(player, XOuyaButton.DOWN, 0);
	    	handled = true;
	    	break;

	    case OuyaController.BUTTON_DPAD_LEFT:
       		setButton(player, XOuyaButton.LEFT, 0);
	    	handled = true;
	    	break;

	    case OuyaController.BUTTON_DPAD_RIGHT:
       		setButton(player, XOuyaButton.RIGHT, 0);
	    	handled = true;
	    	break;
	    }
	    
		return handled || super.onKeyDown(keyCode, event);
	}
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
	    boolean handled = false;

	    int player = OuyaController.getPlayerNumByDeviceId(event.getDeviceId());

	    switch(keyCode) {
	    case OuyaController.BUTTON_MENU:
	    	notifyClient("msgbus.publish('hardware/menu', null);");
	    	break;
	    	
        case OuyaController.BUTTON_O:
        	setButton(player, XOuyaButton.O, 1);
            handled = true;
            break;

        case OuyaController.BUTTON_U:
        	setButton(player, XOuyaButton.U, 1);
            handled = true;
            break;

        case OuyaController.BUTTON_Y:
    		setButton(player, XOuyaButton.Y, 1);
            handled = true;
            break;

	    case OuyaController.BUTTON_A:
       		setButton(player, XOuyaButton.A, 1);
            handled = true;
            
            break;
            
	    case OuyaController.BUTTON_L1:
       		setButton(player, XOuyaButton.L1, 1);
            handled = true;
	    	break;
	    	
	    case OuyaController.BUTTON_R1:
       		setButton(player, XOuyaButton.R1, 1);
            handled = true;
	    	break;
	    	
	    case OuyaController.BUTTON_DPAD_UP:
       		setButton(player, XOuyaButton.UP, 1);
	    	handled = true;
	    	break;

	    case OuyaController.BUTTON_DPAD_DOWN:
       		setButton(player, XOuyaButton.DOWN, 1);
	    	handled = true;
	    	break;

	    case OuyaController.BUTTON_DPAD_LEFT:
       		setButton(player, XOuyaButton.LEFT, 1);
	    	handled = true;
	    	break;

	    case OuyaController.BUTTON_DPAD_RIGHT:
       		setButton(player, XOuyaButton.RIGHT, 1);
	    	handled = true;
	    	break;
	    }
	    
	    if (handled) {
	    	XOuyaController cData = controllers.get(player);
	    	notifyClient("msgbus.publish('hardware/controller', " + cData.getJSON() + ");");
	    }

	    return handled || super.onKeyDown(keyCode, event);
	}
	
	@Override
	public boolean onGenericMotionEvent(final MotionEvent event) {
		int player = OuyaController.getPlayerNumByDeviceId(event.getDeviceId());
	    
	    float LS_X = event.getAxisValue(OuyaController.AXIS_LS_X);
	    float LS_Y = event.getAxisValue(OuyaController.AXIS_LS_Y);
	    float RS_X = event.getAxisValue(OuyaController.AXIS_RS_X);
	    float RS_Y = event.getAxisValue(OuyaController.AXIS_RS_Y);
	    float L2   = event.getAxisValue(OuyaController.AXIS_L2);
	    float R2   = event.getAxisValue(OuyaController.AXIS_R2);
	    
	    XOuyaController cData = controllers.get(player);
	    
	    cData.ls.put("x", (double) LS_X);
	    cData.ls.put("y", (double) LS_Y);
	    cData.rs.put("x", (double) RS_X);
	    cData.rs.put("y", (double) RS_Y);
	    cData.l2 = (double) L2;
	    cData.r2 = (double) R2;

    	notifyClient("msgbus.publish('hardware/controller', " + cData.getJSON() + ");");    	    
		
	    return true;
	}
	
    // source: http://stackoverflow.com/questions/4325639/android-calling-javascript-functions-in-webview
    public void notifyClient(final String scriptSrc) { 
        webView.post(new Runnable() {
            @Override
            public void run() { 
                webView.loadUrl("javascript:" + scriptSrc); 
            }
        }); 
    }
    
}
