<template>
    <div>
        <div class="auth-background" v-if="!isLoggedIn">
            <div class="auth-window">
                <form v-on:submit.prevent="login">
                    <div class="title">LOGIN</div>
                    <input type="text" placeholder="Username" v-model="form.username">
                    <input type="password" placeholder="Password" v-model="form.password">
                    <div class="remember-box">
                        <input type="checkbox" v-model="form.remember">
                        <div class="checkbox-label">Remember me</div>
                    </div>
                    <button class="login-button">LOGIN</button>
                </form>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    data: () => {
        return {
            form: {
                username: "",
                password: "",
                remember: false,
            },
            isLoggedIn: true
        }
    },
    mounted() {
        this.checkLoggedIn();
    },
    methods: {
        checkLoggedIn() {
            if (localStorage.token) {
                this.isLoggedIn = true;
            }
        },
        async login() {
            const response = await axios.post('http://anihuu.moe:8880/login', JSON.stringify(Object.assign({}, this.form)), {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);

            if (response.status == 200) {
                localStorage.token = response.data.token;
                this.isLoggedIn = true;
                console.log(this.isLoggedIn);
            }
        },
    }
}
</script>

<style scoped>

.auth-background {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.814);
    z-index: 3;
    width: 100vw;
    height: 100vh;
}

.auth-window {
    border-radius: 16px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1E2222;
    width: 452px;
    height: 630px;
}

.title {
    color: #F2F2F2;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 67px;
}

form, .remember-box {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.remember-box {
    flex-direction: row;
}

input {
    color: white;
    font-size: 18px;
    font-weight: 500;
    height: 62px;
    padding: 0px 24px;
    width: calc(330px - 24px * 2);
    border-radius: 96px;
    background: #272C2C;
    border: 2px solid transparent;
    margin-top: 15px;
    transition: 100ms ease;
}

input:hover {
    border: 2px solid #FF006B;
}

input:focus {
    outline: none;
    border: 2px solid #8F003C;
}

input::placeholder {
    color: #515A5A;
    font-size: 18px;
    font-weight: 500;
}

.checkbox-label {
    color: #FF006B;
    font-size: 14px;
    margin-left: 2px;
    font-weight: 500;
}

.login-button {
    color: white;
    font-size: 18px;
    font-weight: 600;
    height: 62px;
    padding: 0px 24px;
    width: 330px;
    border: none;
    border-radius: 96px;
    background: #FF006B;
    transition: 100ms ease;
    border-radius: 32px;
    outline: none;
    letter-spacing: 0.11rem;
    font-weight: 800;
    cursor: pointer;
}
</style>