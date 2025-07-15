import pandas as pd
from sqlalchemy import create_engine, Column, Date, Numeric
from sqlalchemy.orm import sessionmaker,declarative_base
import datetime

# ========== 数据库配置 ==========
HOSTNAME = '127.0.0.1'
PORT = 3306
USERNAME = 'root'
PASSWORD = '110110'
DATABASE = 'display'
DB_PATH = f'mysql+pymysql://{USERNAME}:{PASSWORD}@{HOSTNAME}:{PORT}/{DATABASE}?charset=utf8mb4'

Base = declarative_base()

class Weather(Base):
    __tablename__ = 'weather'
    date = Column(Date, primary_key=True)
    temp = Column(Numeric(10, 2))
    wet = Column(Numeric(10, 2))
    sun = Column(Numeric(10, 2))
    tsoil1 = Column(Numeric(10, 2))
    tsoil2 = Column(Numeric(10, 2))
    tsoil3 = Column(Numeric(10, 2))

# ========== 创建数据库 ==========
engine = create_engine(DB_PATH)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()

# ========== 日照估算函数 ==========
def estimate_sunshine_hours(dr_avg, k=0.04, max_hours=14):
    if pd.isna(dr_avg) or dr_avg <= 0:
        return 0
    estimate = k * dr_avg
    return round(min(estimate, max_hours), 2)

# ========== 读取并导入 Excel 数据 ==========
def import_from_excel(file_path):
    df = pd.read_excel(file_path)
    print(df.head())
    for _, row in df.iterrows():
        try:
            date = datetime.date(int(row['yyyy']), int(row['mm']), int(row['dd']))
            temp = round((row['Ta_1_AVG'] + row['Ta_2_AVG']) / 2, 2)
            wet = round((row['RH_1_AVG'] + row['RH_2_AVG']) / 2, 2)
            sun = row['DR_AVG']

            record = Weather(
                date=date,
                temp=temp,
                wet=wet,
                sun=sun,
                tsoil1=round(row['Tsoil_1_AVG'], 2),
                tsoil2=round(row['Tsoil_4_AVG'], 2),
                tsoil3=round(row['Tsoil_6_AVG'], 2),
            )
            session.merge(record)
        except Exception as e:
            print(f"跳过一行数据（{row.get('yyyy', '')}-{row.get('mm', '')}-{row.get('dd', '')}）: {e}")

    session.commit()
    print("数据成功导入数据库！")

# ========== 主程序入口 ==========
if __name__ == "__main__":
    excel_path = "2014年锦州气象日统计数据.xlsx"
    import_from_excel(excel_path)
