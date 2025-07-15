from time import sleep
import requests
from bs4 import BeautifulSoup
import re
import urllib.parse

# url = "https://www.ymt.com/gfw/dn-price-trend/hangqing_chandi/api/origin_price_search_v1?app_key=4001"
# url = "https://www.ymt.com/hangqing/juhe-7355?text=%E5%A4%A7%E9%BA%A6"
ua = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0',
    'Cookie': 'ymtwebgfwuuid=68746c3487044f0ccd3acf89000000; wwwymtcominitedUUID=1; wwwymtcom_uid=343043064257147; acw_tc=1a0c63a317524742337001446e007fcbfe021285dcf1b2f973f21ffaa38964; acw_sc__v2=6874a279ea73a962601053462c6ac07ef5f67f8d',
    'Accept': 'application/json',
}

productid = [7325, 7355, 8468, 8534, 7361]  # 大豆、大麦、小麦、玉米、大米
productname = ['大豆', '大麦', '小麦', '玉米', '大米']

findLink = re.compile('¥(.*?) 元/斤')

def getdata():
    data = {
        'text': 8534,
    }
    values = []
    for pid in productid:
        data['product_id'] = pid
        url = f"https://www.ymt.com/hangqing/juhe-{pid}"
        response = requests.get(url, headers=ua)
        sleep(1)
        response.encoding = 'utf-8'
        # print(response.text)
        html = response.text
        soup = BeautifulSoup(html, 'lxml')
        if soup.find('div', class_='price') is None:
            print(f"未找到价格信息: {productname[productid.index(pid)]}")
            return [2.24, 1.41, 1.27, 0.92, 2.58]
        lts = soup.find_all('div', class_='price')
        value = findLink.findall(lts[0].text)
        values.extend(value)
    return values



if __name__ == '__main__':
    # city_href = getURL()
    # city_href = {'阿巴嘎旗':'http://www.tianqihoubao.com/qihou/abagaqi.htm'}
    # https://www.ymt.com/hangqing/juhe-8534?text=%E7%8E%89%E7%B1%B3
    res = getdata()
