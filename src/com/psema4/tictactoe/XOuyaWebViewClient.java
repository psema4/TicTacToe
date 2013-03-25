package com.psema4.tictactoe;

import android.webkit.WebViewClient;
import android.webkit.WebView;
import android.view.KeyEvent;

public class XOuyaWebViewClient extends WebViewClient {
	public boolean shouldOverrideKeyEvent(WebView view, KeyEvent event) {
		int keyCode = event.getKeyCode();
		boolean result = false;
		
		switch(keyCode) {
		case KeyEvent.KEYCODE_DPAD_UP:
		case KeyEvent.KEYCODE_DPAD_DOWN:
		case KeyEvent.KEYCODE_DPAD_LEFT:
		case KeyEvent.KEYCODE_DPAD_RIGHT:
		case KeyEvent.KEYCODE_BUTTON_A:
		case KeyEvent.KEYCODE_BUTTON_X:
		case KeyEvent.KEYCODE_BUTTON_Y:
		case KeyEvent.KEYCODE_BUTTON_B:
		case KeyEvent.KEYCODE_BUTTON_L1:
		case KeyEvent.KEYCODE_BUTTON_R1:
		case KeyEvent.KEYCODE_BUTTON_THUMBL:
		case KeyEvent.KEYCODE_BUTTON_THUMBR:
			result = true;
			break;
		}
		
		return result;
	}
}
