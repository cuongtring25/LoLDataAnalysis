import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Tiêu đề ứng dụng
st.title('Phân tích Bộ dữ liệu Iris')

# Tải dữ liệu
@st.cache_data
def load_data():
    return sns.load_dataset('iris')

df = load_data()

# Sidebar với các tùy chọn
st.sidebar.header('Tùy chọn')
species = st.sidebar.multiselect(
    'Chọn loài hoa:',
    options=df['species'].unique(),
    default=df['species'].unique()
)

# Lọc dữ liệu
mask = df['species'].isin(species)
filtered_df = df[mask]

# Hiển thị dữ liệu
st.subheader('Dữ liệu Iris')
st.write(filtered_df)

# Thống kê cơ bản
st.subheader('Thống kê cơ bản')
st.write(filtered_df.describe())

# Vẽ biểu đồ
st.subheader('Biểu đồ')
chart_type = st.sidebar.selectbox(
    'Chọn loại biểu đồ:',
    ['Scatter', 'Histogram', 'Box Plot']
)

if chart_type == 'Scatter':
    x_axis = st.sidebar.selectbox('Chọn trục X:', df.columns[:-1])
    y_axis = st.sidebar.selectbox('Chọn trục Y:', df.columns[1:-1])
    
    fig, ax = plt.subplots(figsize=(10, 6))
    for species_name in species:
        species_df = df[df['species'] == species_name]
        ax.scatter(species_df[x_axis], species_df[y_axis], label=species_name, alpha=0.7)
    
    ax.set_xlabel(x_axis)
    ax.set_ylabel(y_axis)
    ax.legend()
    st.pyplot(fig)

elif chart_type == 'Histogram':
    feature = st.sidebar.selectbox('Chọn đặc trưng:', df.columns[:-1])
    bins = st.sidebar.slider('Số lượng bins:', 5, 30, 15)
    
    fig, ax = plt.subplots(figsize=(10, 6))
    for species_name in species:
        species_df = df[df['species'] == species_name]
        ax.hist(species_df[feature], bins=bins, alpha=0.5, label=species_name)
    
    ax.set_xlabel(feature)
    ax.legend()
    st.pyplot(fig)

elif chart_type == 'Box Plot':
    feature = st.sidebar.selectbox('Chọn đặc trưng:', df.columns[:-1])
    
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.boxplot(x='species', y=feature, data=filtered_df, ax=ax)
    st.pyplot(fig)
