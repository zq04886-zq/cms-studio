import json
from pathlib import Path
from playwright.sync_api import sync_playwright

env = dict(line.split('=', 1) for line in Path('cms-node/.env').read_text(encoding='utf-8').splitlines() if '=' in line and not line.startswith('#'))
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page(viewport={'width':1440,'height':1000})
    errors=[]
    page.on('pageerror',lambda error: errors.append(str(error)))
    page.goto('http://127.0.0.1:3300/cms-manage/',wait_until='networkidle')
    page.get_by_placeholder('用户名',exact=True).fill(env['ADMIN_USER'])
    page.get_by_placeholder('密码',exact=True).fill(env['ADMIN_PASSWORD'])
    page.get_by_role('button',name='登录',exact=True).click()
    page.wait_for_url('**/#/home')
    page.get_by_role('button',name='创建页面',exact=True).click()
    page.wait_for_load_state('networkidle')
    names=page.locator('.component-list li .name').all_text_contents()
    for name in names:
        name=name.strip()
        page.locator('.component-list li').filter(has=page.get_by_text(name,exact=True)).dblclick()
        page.locator('.component-title').get_by_text(name,exact=True).wait_for()
        page.wait_for_timeout(150)
        print(json.dumps({'component':name,'errors':errors},ensure_ascii=False))
    page.screenshot(path='verification/all-components.png',full_page=True)
    assert not errors, errors
    # Read data through the UI-rendered component list, then exercise real Sortable mouse dragging.
    frame=page.frame_locator('#previewIframe')
    items=frame.locator('.draggable > .components')
    assert items.count()==len(names)
    first=items.nth(0).bounding_box(); second=items.nth(1).bounding_box()
    page.mouse.move(first['x']+180,first['y']+20)
    page.mouse.down()
    page.mouse.move(second['x']+180,second['y']+second['height']-5,steps=20)
    page.mouse.up()
    page.wait_for_timeout(400)
    assert not errors, errors
    print('All component editors rendered and drag interaction completed without runtime errors')
    browser.close()
