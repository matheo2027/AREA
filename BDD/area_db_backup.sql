--
-- PostgreSQL database dump
--

-- Dumped from database version 13.18
-- Dumped by pg_dump version 13.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actions; Type: TABLE; Schema: public; Owner: area_user
--

CREATE TABLE public.actions (
    id integer NOT NULL,
    service_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    parameters jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.actions OWNER TO area_user;

--
-- Name: actions_id_seq; Type: SEQUENCE; Schema: public; Owner: area_user
--

CREATE SEQUENCE public.actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actions_id_seq OWNER TO area_user;

--
-- Name: actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: area_user
--

ALTER SEQUENCE public.actions_id_seq OWNED BY public.actions.id;


--
-- Name: reactions; Type: TABLE; Schema: public; Owner: area_user
--

CREATE TABLE public.reactions (
    id integer NOT NULL,
    service_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    parameters jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reactions OWNER TO area_user;

--
-- Name: reactions_id_seq; Type: SEQUENCE; Schema: public; Owner: area_user
--

CREATE SEQUENCE public.reactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reactions_id_seq OWNER TO area_user;

--
-- Name: reactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: area_user
--

ALTER SEQUENCE public.reactions_id_seq OWNED BY public.reactions.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: area_user
--

CREATE TABLE public.services (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.services OWNER TO area_user;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: area_user
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.services_id_seq OWNER TO area_user;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: area_user
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: user_services; Type: TABLE; Schema: public; Owner: area_user
--

CREATE TABLE public.user_services (
    id integer NOT NULL,
    user_id integer NOT NULL,
    service_id integer NOT NULL,
    access_token text,
    refresh_token text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_services OWNER TO area_user;

--
-- Name: user_services_id_seq; Type: SEQUENCE; Schema: public; Owner: area_user
--

CREATE SEQUENCE public.user_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_services_id_seq OWNER TO area_user;

--
-- Name: user_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: area_user
--

ALTER SEQUENCE public.user_services_id_seq OWNED BY public.user_services.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: area_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO area_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: area_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO area_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: area_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: actions id; Type: DEFAULT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.actions ALTER COLUMN id SET DEFAULT nextval('public.actions_id_seq'::regclass);


--
-- Name: reactions id; Type: DEFAULT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.reactions ALTER COLUMN id SET DEFAULT nextval('public.reactions_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: user_services id; Type: DEFAULT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.user_services ALTER COLUMN id SET DEFAULT nextval('public.user_services_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: actions; Type: TABLE DATA; Schema: public; Owner: area_user
--

COPY public.actions (id, service_id, name, description, parameters, created_at) FROM stdin;
\.


--
-- Data for Name: reactions; Type: TABLE DATA; Schema: public; Owner: area_user
--

COPY public.reactions (id, service_id, name, description, parameters, created_at) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: area_user
--

COPY public.services (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_services; Type: TABLE DATA; Schema: public; Owner: area_user
--

COPY public.user_services (id, user_id, service_id, access_token, refresh_token, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: area_user
--

COPY public.users (id, username, email, password_hash, created_at, updated_at) FROM stdin;
\.


--
-- Name: actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: area_user
--

SELECT pg_catalog.setval('public.actions_id_seq', 1, false);


--
-- Name: reactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: area_user
--

SELECT pg_catalog.setval('public.reactions_id_seq', 1, false);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: area_user
--

SELECT pg_catalog.setval('public.services_id_seq', 1, false);


--
-- Name: user_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: area_user
--

SELECT pg_catalog.setval('public.user_services_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: area_user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: actions actions_pkey; Type: CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: reactions reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT reactions_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: user_services user_services_pkey; Type: CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.user_services
    ADD CONSTRAINT user_services_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: actions fk_service_id; Type: FK CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT fk_service_id FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: reactions fk_service_id; Type: FK CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.reactions
    ADD CONSTRAINT fk_service_id FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: user_services fk_service_id; Type: FK CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.user_services
    ADD CONSTRAINT fk_service_id FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: user_services fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: area_user
--

ALTER TABLE ONLY public.user_services
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

