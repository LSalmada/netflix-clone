import React, { useEffect, useState } from "react";

import Tmdb from "./js/Tmdb.js";

import "./App.css";

import FeatureMovie from "./components/FeatureMovie";
import MovieRow from "./components/MovieRow";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";

const App = () => {
	const [movieList, setMovieList] = useState([]);
	const [featureData, setfeatureData] = useState(null);
	const [blackHeader, setBlackHeader] = useState(false);

	//Refatorar para um script separado
	useEffect(() => {
		const loadAll = async () => {
			//Pegar a lista total
			let list = await Tmdb.getHomeList();
			setMovieList(list);
			//Pegando o Feature
			let originals = list.filter((i) => i.slug === "originais");
			let randomChosen = Math.floor(
				Math.abs(
					Math.random() * Object.keys(originals[0].items.results).length - 1
				)
			);
			let chosen = originals[0].items.results[randomChosen];
			while (chosen.overview === "") {
				randomChosen = Math.floor(
					Math.abs(
						Math.random() * Object.keys(originals[0].items.results).length - 1
					)
				);
				chosen = originals[0].items.results[randomChosen];
			}
			let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
			setfeatureData(chosenInfo);
		};

		loadAll();
	}, []);

	//Refatorar para um script separado
	useEffect(() => {
		const scrollListener = () => {
			if (window.scrollY > 10) setBlackHeader(true);
			else {
				setBlackHeader(false);
			}
		};
		window.addEventListener("scroll", scrollListener);
		return () => {
			window.removeEventListener("scroll", scrollListener);
		};
	}, []);

	return (
		<div className="page">
			<Header black={blackHeader} />
			{featureData != null && <FeatureMovie item={featureData} />}
			<section className="lists">
				{movieList.map((item, key) => (
					<MovieRow key={key} title={item.title} items={item.items} />
				))}
			</section>
			<Footer />
			{movieList.length <= 0 && <LoadingScreen />}
		</div>
	);
};

export default App;

//03516afea9132604091f442d87db9280
