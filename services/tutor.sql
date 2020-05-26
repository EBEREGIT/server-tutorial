--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

-- Started on 2020-05-26 11:02:31

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
-- TOC entry 203 (class 1259 OID 49321)
-- Name: images; Type: TABLE; Schema: public; Owner: tutorial
--

CREATE TABLE public.images (
    id integer NOT NULL,
    title character varying(128) NOT NULL,
    cloudinary_id character varying(128) NOT NULL,
    image_url character varying(128) NOT NULL
);


ALTER TABLE public.images OWNER TO tutorial;

--
-- TOC entry 202 (class 1259 OID 49319)
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: tutorial
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO tutorial;

--
-- TOC entry 2823 (class 0 OID 0)
-- Dependencies: 202
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tutorial
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- TOC entry 2687 (class 2604 OID 49324)
-- Name: images id; Type: DEFAULT; Schema: public; Owner: tutorial
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- TOC entry 2817 (class 0 OID 49321)
-- Dependencies: 203
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: tutorial
--

COPY public.images (id, title, cloudinary_id, image_url) FROM stdin;
8	Heroku Image	ywdrgacv79cg18ap0w7l	https://res.cloudinary.com/dunksyqjj/image/upload/v1590431624/ywdrgacv79cg18ap0w7l.jpg
\.


--
-- TOC entry 2824 (class 0 OID 0)
-- Dependencies: 202
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tutorial
--

SELECT pg_catalog.setval('public.images_id_seq', 8, true);


--
-- TOC entry 2689 (class 2606 OID 49326)
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: tutorial
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


-- Completed on 2020-05-26 11:02:33

--
-- PostgreSQL database dump complete
--

